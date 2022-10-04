import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { Post } from './post.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable({
  providedIn: 'root',
})


export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  

  constructor(
    private http: HttpClient, 
    private router: Router
    ) {}


  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map( post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator:post.creator,
                
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        console.log('@@RES DO GET transformedPostsData',transformedPostsData)
        this.posts = transformedPostsData.posts;

        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  postUpdated() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    //Nome do backend
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((res) => {
        console.log('@@res do post', res);
        //NAO é mais necessario 
        // const post: Post = {
        //   id: res.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: res.post.imagePath,
        // };

        //Reescrevendo o id pra n ir null
        // const id = res.postId;
        // post.id = id;

        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath:null};

    let postData: Post | FormData;

    if (typeof image === 'object') {
      postData = new FormData();

      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = { id: id,
        title: title, 
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http.put(BACKEND_URL + id, postData).subscribe((res) => {
      console.log('@res do service', res);
      const postsAtualizados = [...this.posts];
      const antigosPosts = postsAtualizados.findIndex((p) => p.id === id);
      //NAO é mais necessario
      // const post: Post = {
      //   id: id,
      //   title: title,
      //   content: content,
      //   imagePath: '',
      // };

      // postsAtualizados[antigosPosts] = post; 
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    console.log('@@Service', BACKEND_URL + id);
    return this.http.delete(BACKEND_URL + id);
  }
}
