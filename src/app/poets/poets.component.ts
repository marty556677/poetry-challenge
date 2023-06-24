import { Component, OnInit } from '@angular/core';
import { PoetryService } from '../poetry.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-poets',
  templateUrl: './poets.component.html',
  styleUrls: ['./poets.component.css'],
})
export class PoetsComponent implements OnInit {
  constructor(private poetryService: PoetryService) {}
  authorDefault: String = "--Choose Author--"
  titleDefault: String = "--Choose Title--"

  selectedAuthor: String = this.authorDefault;
  selectedTitle: String = this.titleDefault;
  authorSearchValue: String = "";
  titleSearchValue: String = "";
  authorData:String[] = [];
  titleData:String[] = [];
  poemsData:any | undefined;
  hasError:boolean = false;

  ngOnInit(): void {
    this.poetryService.getAuthors().subscribe( resp => { this.authorData = resp });
  }

  AuthorChanged() {
    if (this.selectedAuthor === this.authorDefault)
      this.onReset();
    else
      this.poetryService.getTitles(this.selectedAuthor.toString()).subscribe( resp => { this.titleData = resp });
  }

  TitleChanged() {
    if (this.selectedTitle === this.titleDefault)
      this.poemsData = [];
    else
      this.poetryService.getPoems(this.selectedAuthor.toString(), this.selectedTitle.toString()).subscribe( resp => { this.poemsData = resp });
  }

  onSearch() {
    this.poemsData = [];
    this.hasError = false;
       this.poetryService.getPoems(this.authorSearchValue.toString(), this.titleSearchValue.toString()).subscribe(
        (data) => {   
          this.poemsData = data; 
          //so even though the response json shows a 404 when the search terms are not found, the actual response is still 200.
          if(this.poemsData != null && this.poemsData?.status != null && this.poemsData?.status != "200"){
            this.hasError = true;
            throw data;
          }
        }
       );
  }

  onReset(){
    this.poemsData = [];  
    this.selectedAuthor = this.authorDefault;
    this.selectedTitle = this.titleDefault;
    this.authorSearchValue = "";
    this.titleSearchValue = "";
    this.titleData = [];
    this.hasError = false;
  }
  
}
