import React, {Component} from 'react';
import { gql } from "@apollo/client";
import client from '../apollo-client'
import Layout from '../components/layout'

//
export default class Test extends Component {
  static async getInitialProps(ctx) {
    return {
      data: [],
    }
  }  
  constructor(props){
    super(props)
//console.log(props);
  }
  async componentDidMount(){
    try{
      const site_id = process.env.MY_SITE_ID;
      const url = process.env.API_URL +"/api/get/find?content=category&site_id=" +site_id
      const res = await fetch(url)    
      const json = await res.json()
console.log(json)
//console.log(data);
    } catch (e) {
      console.error(e);
    }
  }   
  async clickHandle(){
console.log("#clickHandle");
  }
  render() {
    return (
      <Layout>
        <div className="container">
          <hr className="mt-2 mb-2" />
          <h1>test</h1>
          <hr />
          <button onClick={() =>this.clickHandle() }>Test</button>
        </div>
      </Layout>
    )    
  } 
}
