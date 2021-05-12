import React from 'react';
import './index.css'
import {nanoid} from 'nanoid';

export default class Move extends React.Component {

    state = {
        id:Array(2).fill(1).map(()=>nanoid()),
    };

    leftClick = ()=>{
        this.props.move(-1);
        console.log("left");
    }
    rightClick = ()=>{
        this.props.move(1);
        console.log("right");

    }    

    render (){
        return (
            <div key="184" className="moveKey">
                <button key={this.state.id[0]} onClick={this.leftClick}> LEFT </button>
                <button key={this.state.id[1]} onClick={this.rightClick}> RIGHT </button>           
            </div>

        )
    }
}