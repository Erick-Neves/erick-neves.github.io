import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/model/Article';
import { AlertsService } from 'src/app/service/alerts.service';
import { ArticleService } from 'src/app/service/article.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'delete-article',
  templateUrl: './delete-article.component.html',
  styleUrls: ['./delete-article.component.css']
})
export class DeleteArticleComponent implements OnInit {

  
  article: Article = new Article
  articleName: string
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    if(environment.token == ''){
      this.alerts.showAlertInfo("Token expired, login to generate another")
      this.router.navigate(['/auth/login'])
    }
    let id = this.route.snapshot.params['id']
    this.findByIdArticle(id)
  }

  findByIdArticle(id: number){
    this.articleService.getById(id)
    .subscribe((resp: Article) => {
      this.article = resp
      this.articleName = resp.title
    })
  }

  delete(){
    this.articleService.deleteArticle(this.article.id)
    .subscribe((resp) =>{
      this.alerts.showAlertSuccess("Artigo deletado com sucesso!")
      this.router.navigate(['/forum'])
    })
  }
}
