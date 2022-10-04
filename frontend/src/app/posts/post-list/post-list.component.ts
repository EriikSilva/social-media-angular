import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostService } from '../post.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false
  userId:string;
  private postSub: Subscription;
  private authStatusSubs: Subscription;
  

  constructor(
    public postsService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postSub = this.postsService
      .postUpdated()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        console.log('@Lista Atualizada de posts=> ', postData);
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    //checa se ta autenticado
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }

  onChangePage(pageData: PageEvent) {
    console.log('@o que temos no component da paginacao: ', pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe((res) => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    } , () => {
      this.isLoading = false;
    });
    // console.log(id);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
