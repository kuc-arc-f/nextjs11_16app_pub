import React  from 'react';
import { gql } from "@apollo/client";
import client from '../../../../apollo-client'

//import LibFlash from '../../lib/LibFlash';
import Layout from '../../../../components/layout'
import LibContent from '../../../../lib/LibContent';
import LibNote from '../../../../lib/LibNote';
//
interface IState {
  id: number,
  title: string,
  content: string,
  categoryItems: Array<any>,
  tagItems: Array<any>,
  radioItems: Array<any>,
  radio_1: string,
  category: string,
}
interface IProps {
  history: string[],
  item: any,
  id: number,
  tags: Array<any>,
  noteTags: Array<any>,
}
class TaskEdit extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
    const id = ctx.query.id;
    const data = await client.query({
      query: gql`
      query {
        note(id: "${id}") {
          id
          title
          content
          noteType
          category
        }
      }
      `,
      fetchPolicy: "network-only"
    });
  console.log(data.data.note);     
    const row:any = data.data.note;
    const dataTag = await client.query({
      query: gql`
      query {
        noteTags(noteId: "${id}") {
          id
          name
        }
      }      
      `,
      fetchPolicy: "network-only"
    });  
console.log(dataTag.data.noteTags);   
    const noteTags = [];
    const tags = dataTag.data.noteTags;
    return {
      id: id,
      item: row,
      tags: tags,
      noteTags: noteTags,
    };
  }  
  constructor(props: any) {
    super(props);
console.log(props);
    this.state = {
      id: props.id,
      title: props.item.title,
      content: props.item.content,
      category: props.item.category,
      radio_1: props.item.noteType,
      categoryItems: [], tagItems: [],
      radioItems: [],
    };
  }
  async componentDidMount(){
    const site_id = process.env.MY_SITE_ID;
    const url = process.env.API_URL +"/api/get/find?content=category&site_id=" +site_id
    const res = await fetch(url)    
    const json = await res.json()
    const urlTypes = process.env.API_URL +"/api/get/find?content=types&site_id=" +site_id
    const resTypes = await fetch(urlTypes)    
    const jsonTypes = await resTypes.json()
console.log(jsonTypes);
    const categoryItems = json;
    const radioItems = jsonTypes;
    const urlTags = process.env.API_URL +"/api/get/find?content=tags&site_id=" +site_id
    const resTags = await fetch(urlTags)    
    const jsonTags = await resTags.json()
    const tagItems = jsonTags;
console.log(this.props)
    this.setState({
      categoryItems: categoryItems, tagItems: tagItems, radioItems: radioItems 
    });
    const category = document.querySelector<HTMLInputElement>('#category');
    category.value = this.props.item.category;
//    const pub_date = document.querySelector<HTMLInputElement>('#pub_date');
//    pub_date.value= this.props.item.values.pub_date;    
  }
  async clickHandler(){
    try {
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      const category = document.querySelector<HTMLInputElement>('#category');
      //const pub_date = document.querySelector<HTMLInputElement>('#pub_date');
      const arrChecked = [] 
      const check_items = this.state.tagItems;  
      check_items.forEach(function(item, index){
console.log(item.name) 
        let checkedName = "check_" + index;
        let elemChecked = document.querySelector<HTMLInputElement>('#'+ checkedName);
        if(elemChecked.checked){
          arrChecked.push(item.name)
        }
      });      
//console.log(arrChecked)      
      const item = {
        title: title.value,
        content: content.value,
        category: category.value,
        radio_1: this.state.radio_1,
      }
console.log(item);
      let result = await client.mutate({
        mutation:gql`
        mutation {
          noteUpdate(id: "${this.state.id}", title: "${item.title}", content: "${item.content}"
          category:"${item.category}", noteType:"${item.radio_1}"){
            id
          }
        }
      `
      });
console.log(result);
      if(result.data.noteUpdate.id === 'undefined'){
        throw new Error('Error , noteAdd');
      }
      result = await client.mutate({
        mutation:gql`
        mutation {
          noteTagDelete(noteId: "${this.state.id}")
        }        
      `
      });
console.log(result); 
      for (let row of arrChecked) {
console.log(row);
        result = await client.mutate({
          mutation:gql`
          mutation {
            noteTagAdd(noteId: "${this.state.id}", name: "${row}"){
              id
            }
          }                      
        `
        });
      }           
      alert("Complete, update");
      location.href = '/apollo/notes';
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  }
  async deleteHandler(){
    try {
      let result = await client.mutate({
        mutation:gql`
        mutation {
          noteDelete(id: "${this.state.id}"){
            id
          }
        }        
      `
      });
console.log(result);      
      alert("Complete, delete");
      location.href = '/apollo/notes';
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }
  }
  valid_check(items , value){
    let valid = false
    const rows = items.filter(item => (item.name === value));
    if( rows.length > 0){ valid = true }
    return valid
  }  
  checkRow(){
//console.log(this.props.tags);
    const check_items = this.state.tagItems;
    return check_items.map((item: any, index: number) => {
//console.log(item.name );
      let valid = this.valid_check(this.props.tags , item.name)
      let name = "check_" + index;
      return(
        <label key={index}>
          <input type="checkbox" name={name} id={name} defaultChecked={valid} />
          <span className="px-2">{item.name}</span>
        </label>           
      )      
    })
  }
  handleChangeRadio(e){
    this.setState({radio_1: e.target.value})
  }    
  render() {
//console.log(this.state.tagItems);
    return (
    <Layout>
      <div className="container py-2">
        <h3>Notes - Edit</h3>
        ID : {this.state.id} 
        <hr />   
        <label>Title:</label>
        <input type="text" name="title" id="title"
          defaultValue={this.state.title} />
        <hr />
        <label>Content:</label>
        <input type="text" name="content" id="content" 
        defaultValue={this.state.content} />
        <hr />
        <div className="col-md-6 form-group">
          <label>Category:</label>
          <select className="form-select" name="category" id="category">
          {this.state.categoryItems.map((item ,index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))
          }
        </select>
        <hr />
        <label>RadioType:</label><br />
        {this.state.radioItems.map((item ,index) => {
//console.log(item);
          return (
            <span key={index}>
              <input type="radio" name="radio_1" id="radio_1" value={item.name}
              defaultChecked={this.state.radio_1 === item.name}
              onChange={this.handleChangeRadio.bind(this)} />
                {item.name}<br />
            </span>
          );
        })
        }
        <hr />
        Tags:<br />
        {this.checkRow()}
        </div>
        <hr />      
        <button onClick={() => {this.clickHandler()}}>Save
        </button>   
        <hr />
        <button onClick={() => {this.deleteHandler()}}>Delete
        </button>
      </div>
    </Layout>
    );
  }
}
export default TaskEdit;
