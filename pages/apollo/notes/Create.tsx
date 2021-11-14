import React  from 'react';
import moment from 'moment';
import { gql } from "@apollo/client";
import client from '../../../apollo-client'
//import LibFlash from '../../../lib/LibFlash';
import LibAuth from '../../../lib/LibAuth';
import LibContent from '../../../lib/LibContent';
import Layout from '../../../components/layout'

interface IState {
  user_id: string,
  categoryItems: Array<any>,
  tagItems: Array<any>,
  radioItems: Array<any>,
  radio_1: string,
}
interface IProps {
  history: string[],
  csrf: any,
  apikey: string,
}
//
class NoteCreate extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "" , categoryItems: [], tagItems:[], radioItems: [], radio_1: '',
    };
  }
  async componentDidMount(){
    const valid = LibAuth.valid_login(this.props)
    if(valid){
      const uid = LibAuth.get_uid()
console.log("uid=", uid);
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
//console.log(radioItems);
      this.setState({
        user_id: uid ,categoryItems: categoryItems, tagItems: tagItems,
        radioItems: radioItems,
      })
//      const dt = moment().format('YYYY-MM-DD');
//      const pub_date = document.querySelector<HTMLInputElement>('#pub_date');
//      pub_date.value= dt;      
    }
  }
  async clickHandler(){
    try {
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      const category = document.querySelector<HTMLInputElement>('#category');
      const arrChecked = [] 
      const check_items = this.state.tagItems;  
      check_items.forEach(function(item, index){
//console.log(item.name);
        let checkedName = "check_" + index;
        let elemChecked = document.querySelector<HTMLInputElement>('#'+ checkedName);
        if(elemChecked.checked){
          arrChecked.push(item.name)
        }
      });      
console.log(arrChecked)      
      const item = {
        title: title.value,
        content: content.value,
        category: category.value,
        noteType: this.state.radio_1,
      }
console.log(item);      
//console.log("user_id=", this.state.user_id);      
      let noteId = "";
      let result = await client.mutate({
        mutation:gql`
        mutation {
          noteAdd(title: "${item.title}", content: "${item.content}",
            category:"${item.category}", noteType:"${item.noteType}")
          {
            id
          }
        }            
      `
      });
console.log(result);
      if(result.data.noteAdd.id === 'undefined'){
        throw new Error('Error , noteAdd');
      }
      noteId = result.data.noteAdd.id;
console.log("noteId=", noteId);  
      for (let row of arrChecked) {
console.log(row);
        result = await client.mutate({
          mutation:gql`
          mutation {
            noteTagAdd(noteId: "${noteId}", name: "${row}"){
              id
            }
          }                      
        `
        });
      }    
      location.href = '/apollo/notes';
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }
  }
  checkRow(){
    const check_items = this.state.tagItems;
    return check_items.map((item: any, index: number) => {
// console.log(item.values.name );
      let name = "check_" + index;
      return(
        <label key={index}>
          <input type="checkbox" name={name} id={name}/>
          <span className="px-2">{item.name}</span>
        </label>           
      )      
    })
  }
  handleChangeRadio(e){
    this.setState({radio_1: e.target.value})
  }
  render() {
console.log(this.state.tagItems);
    return (
    <Layout>
      <div className="container py-2">
        <h3>Notes - Create</h3>
        <hr />
        <label>Title:</label>
        <input type="text" name="title" id="title" />
        <hr />
        <label>Content:</label>
        <input type="text" name="content" id="content" />
        <hr />
        <div className="col-md-6 form-group">
          <label>Category:</label>
          <select className="form-select" name="category" id="category">
          {this.state.categoryItems.map((item ,index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))
          }
          </select>
        </div>
        <hr />
        <label>RadioType:</label><br />
        {this.state.radioItems.map((item ,index) => {
console.log(item);
          return (
            <span key={index}>
              <input type="radio" name="radio_1" id="radio_1" value={item.name}
              onChange={this.handleChangeRadio.bind(this)} />
                {item.name}<br />
            </span>
          );
        })
        }         
        <hr />
        Tag:<br />
        {this.checkRow()}
        <hr />
        <button onClick={() => {this.clickHandler()}}>
        Save
        </button>        
      </div>      
    </Layout>
    );
  }
}
export default NoteCreate;
