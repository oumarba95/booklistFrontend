import { AuthService } from './../service/auth.service';
import { AuthStatusService } from './../auth-status.service';
import { BookService } from './../service/book.service';
import { Component, OnInit,Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.css']
})
export class CommentaireComponent implements OnInit {
  @Input() comment;
  answerCurrentUser;
  otherAnswers;
  contenu;
  article;
  resp;
  repondre:Boolean;
  user_id = +sessionStorage.getItem('user_id');
  color_like;
  color_dislike;
  color_answer_like;
  color_answer_dislike;
  repondreLabel;
  afficheReponse = false;
  loggedIn;

  constructor(private bookService:BookService,private auth: AuthService,private AuthS:AuthStatusService,private router:Router) { }

  ngOnInit(): void {
        
        this.answerUser();
        this.answerOther();
        this.commentLikedByUser();
        this.commentdisLikedByUser();
        this.answerDisLikedByUser();
        this.answerLikedByUser();
        this.repondreLab();
    this.auth.logoutSub.subscribe(
      (data) => {
        this.otherAnswers = this.comment.answers;
        this.answerCurrentUser = [];
        const commentlength = this.comment.answers.length > 1 ? this.comment.answers.length : '';
        const article = this.comment.answers.length > 1 ? 'les' : 'la';
        const resp = this.comment.answers.length > 1 ? 'responses' :'reponse';
        this.repondreLabel = this.comment.answers.length > 0 ? `Afficher ${article} ${commentlength} ${resp}` :'';
      }
    )
    
    this.AuthS.loggedInObs.subscribe(
      (data) => {
        this.loggedIn = data;
      }
    );
 
    

    }
formForAnswer(e){
  e.preventDefault();
  if (this.loggedIn)
       this.repondre = !this.repondre;
  else
    this.router.navigateByUrl(`/login?from=${this.router.url}`);
}
answerUser(){
  const answers = this.comment.answers.filter(
    (answer) => answer.user_id == this.user_id
  )
  this.answerCurrentUser = answers;
}
answerOther(){
  const answers = this.comment.answers.filter(
    (answer) => answer.user_id !== this.user_id
  );
  this.otherAnswers = answers;
  console.log(answers);
}  
addAnswer(e){
  const rep = e.target.textContent;
  console.log(rep);
  e.target.textContent = 'Patienter...';
  const answer = {
     user_id:this.user_id,
     comment_id:this.comment.id,
     contenu:this.contenu
  };
  this.bookService.addanswer(answer).subscribe(
    (answer:any) =>{
     this.comment.answers.push(answer.data);
     this.answerCurrentUser.push(answer.data);
     this.answerLikedByUser();
     this.contenu = null;
     this.repondre = !this.repondre;
     this.answerDisLikedByUser();
     e.target.textContent = rep;
  }
    )
}
likeComment(e){
  e.preventDefault();
  const like = {
    user_id : this.user_id,
    comment_id : this.comment.id
  };

  this.bookService.likeComment(like).subscribe(
    (response:any) => {
      if(response.likeSupprime){
        const index = this.findInd(response.likeSupprime,this.comment.liked_by);
        let commentsLikes;
        if(index !== 0)
            commentsLikes = [...this.comment.liked_by.slice(0,index),...this.comment.liked_by.slice(index+1)];
        else
           commentsLikes = [...this.comment.liked_by.slice(1)];
        this.comment.liked_by = commentsLikes;
        this.commentLikedByUser();
        this.commentdisLikedByUser();
        return true;
           
      } else if (response.dislikeRemoved)  {
        let commentsdislikes;
        const index = this.findInd(response.dislikeRemoved,this.comment.disliked_by);
        if(index !== 0)
           commentsdislikes = [...this.comment.disliked_by.slice(0,index),...this.comment.disliked_by.slice(index+1)];
        else
          commentsdislikes = [...this.comment.disliked_by.slice(1)];
        this.comment.disliked_by = commentsdislikes;
        this.comment.liked_by.push(response.like);
        this.commentLikedByUser();
        this.commentdisLikedByUser();
        return true;
      }    
      this.comment.liked_by.push(response.like);
      this.commentLikedByUser();
    },
    (error) =>console.log(error.error.error)
  );
}
commentLikedByUser(){
  
   const usersLikes = this.comment.liked_by.filter(
       (like) => {
         return like.user_id == this.user_id;
       }
   );
   if(usersLikes.length > 0)
      this.color_like = 'blue';
    else{
      this.color_like = 'lightgray';
    }
}
commentdisLikedByUser(){
  const usersdislikes = this.comment.disliked_by.filter(
      (dislike) => {
        return dislike.user_id == this.user_id;
      }
  );
  if(usersdislikes.length > 0)
     this.color_dislike = 'blue';
  else{
     this.color_dislike = 'lightgray';
   }
}
answerLikedByUser(){
  this.comment.answers.forEach(answer => {
    const userLikes = answer.liked_by.filter((like) => { return like.user_id == this.user_id});
  if (userLikes.length > 0)
       answer.like_color = 'blue';
   else
      answer.like_color = 'lightgray';
})
}
answerDisLikedByUser(){
  this.comment.answers.forEach(answer => {
    const userdisLikes = answer.disliked_by.filter((dislike) => dislike.user_id == this.user_id);
  if (userdisLikes.length > 0)
       answer.dislike_color = 'blue';
   else
      answer.dislike_color = 'lightgray';
})
}
findInd(act,comment){
  const index = comment.findIndex(
    (action) => {
       return action.id == act.id;
    }
  );
  return index;
}
repondreLab(){
  const answerLength = this.comment.answers.length-this.answerCurrentUser.length;
  const article = answerLength > 1 ? 'les' : 'la';
  const resp = answerLength > 1 ? 'responses' :'reponse';
  const answerLengthAff = answerLength > 1 ? answerLength:'';
  if (answerLength > 0)
      this.repondreLabel = `Afficher ${article} ${answerLengthAff} ${resp}`;
}
reponse(e){
  e.preventDefault();
  const answerLength = this.comment.answers.length-this.answerCurrentUser.length;
  const article = answerLength > 1 ? 'les' : 'la';
  const resp = answerLength > 1 ? 'responses' :'reponse';
  const answerLengthAff = answerLength > 1 ? answerLength :'';
  this.afficheReponse = !this.afficheReponse;
  if(this.afficheReponse)
       this.repondreLabel = `Masquer ${article} ${answerLengthAff} ${resp}`
  else
    this.repondreLabel = `Afficher ${article} ${answerLengthAff} ${resp}`;
}
dislikeComment(e){
  e.preventDefault();
  console.log(this.comment.user_id)
  const dislike = {
    user_id : this.user_id,
    comment_id : this.comment.id
  };
  this.bookService.dislikeComment(dislike).subscribe(
    (response:any) => {
      if(response.dislikeRemoved){
        const index = this.findInd(response.dislikeRemoved,this.comment.disliked_by);
        let commentsdislikes;
        if(index !== 0)
            commentsdislikes = [...this.comment.disliked_by.slice(0,index),...this.comment.disliked_by.slice(index+1)];
        else
           commentsdislikes = [...this.comment.disliked_by.slice(1)];
        this.comment.disliked_by = commentsdislikes;
        this.commentLikedByUser();
        this.commentdisLikedByUser();
 
        return true;
           
      } else if (response.likeRemoved)  {
        let commentslikes;
        const index = this.findInd(response.likeRemoved,this.comment.liked_by);
        if(index !== 0)
           commentslikes = [...this.comment.liked_by.slice(0,index),...this.comment.liked_by.slice(index+1)];
        else
          commentslikes = [...this.comment.liked_by.slice(1)];
        this.comment.liked_by = commentslikes;
        this.comment.disliked_by.push(response.dislike);
        this.commentLikedByUser();
        this.commentdisLikedByUser();
 
        return true;
      }  
      this.comment.disliked_by.push(response.dislike);
      this.commentdisLikedByUser();
     
    }
  );
}
likeAnswer(e,id){
  e.preventDefault();
  const like = {
    user_id : this.user_id,
    answer_id : id
  };
  const index = this.comment.answers.findIndex(
    (answer) =>{
      return answer.id == id;
    }
  )
 
  this.bookService.likeAnswer(like).subscribe(
    (response:any) => {
      if (response.likeRemoved){
         const inde = this.findInd(response.likeRemoved,this.comment.answers[index].liked_by);
         let answerLikes;
         if(inde !== 0)
            answerLikes = [...this.comment.answers[index].liked_by.slice(0,inde),...this.comment.answers[index].liked_by.slice(inde+1)];
          else
             answerLikes =[...this.comment.answers[index].liked_by.slice(1)];
          this.comment.answers[index].liked_by = answerLikes;
          this.answerDisLikedByUser();
          this.answerLikedByUser();
          return true;
      }else if (response.dislikeRemoved){
        const inde = this.findInd(response.dislikeRemoved,this.comment.answers[index].disliked_by);
        let answerdislikes;
        if(inde !== 0)
           answerdislikes = [...this.comment.answers[index].disliked_by.slice(0,inde),...this.comment.answers[index].disliked_by.slice(inde+1)];
         else
            answerdislikes =[...this.comment.answers[index].disliked_by.slice(1)];
        this.comment.answers[index].disliked_by = answerdislikes;
        this.comment.answers[index].liked_by.push(response.like);
        this.answerDisLikedByUser();
        this.answerLikedByUser();
        return true;      
      }
      this.comment.answers[index].liked_by.push(response.like);
      this.answerLikedByUser();
    }
  );
}
dislikeAnswer(e,id){
  e.preventDefault();
  const dislike = {
    user_id : this.user_id,
    answer_id : id
  };
  const index = this.comment.answers.findIndex(
    (answer) =>{
      return answer.id == id;
    }
  )
 
  this.bookService.dislikeAnswer(dislike).subscribe(
    (response:any) =>{
      if (response.dislikeRemoved){
        const inde = this.findInd(response.dislikeRemoved,this.comment.answers[index].disliked_by);
        let answerdislikes;
        if(inde !== 0)
           answerdislikes = [...this.comment.answers[index].disliked_by.slice(0,inde),...this.comment.answers[index].disliked_by.slice(inde+1)];
         else
            answerdislikes =[...this.comment.answers[index].disliked_by.slice(1)];
         this.comment.answers[index].disliked_by = answerdislikes;
         this.answerDisLikedByUser();
         this.answerLikedByUser();
         return true;
     }else if (response.likeRemoved){
       const inde = this.findInd(response.likeRemoved,this.comment.answers[index].liked_by);
       let answerlikes;
       if(inde !== 0)
          answerlikes = [...this.comment.answers[index].liked_by.slice(0,inde),...this.comment.answers[index].liked_by.slice(inde+1)];
        else
           answerlikes =[...this.comment.answers[index].liked_by.slice(1)];
       this.comment.answers[index].liked_by = answerlikes;
       this.comment.answers[index].disliked_by.push(response.dislike);
       this.answerDisLikedByUser();
       this.answerLikedByUser();
       return true;      
     }
      this.comment.answers[index].disliked_by.push(response.dislike);
      this.answerDisLikedByUser();
    } 
  );
}
}
