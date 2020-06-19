export class Book{
    id:number;
    constructor(public titre:string,public auteur:string,public image:string,public description:string,public comments:any[]){}
}