import React from 'react';
import './index.css'
import {nanoid} from 'nanoid';

export default class Rotate extends React.Component {

    state = {
        id:nanoid(),
        posMap:new Map([
            ['O',[[5,6,15,16]]],
            ['I',[[13,14,15,16],[4,14,24,34]]],
            ['Z',[[4,5,15,16],[5,14,15,24]]],
            ['L',[[5,13,14,15],[4,5,15,25],[3,4,5,13],[3,13,23,24]]],
            ['J',[[3,13,14,15],[5,15,24,25],[3,4,5,15],[3,4,13,23]]],
            ['T',[[4,13,14,15],[4,13,14,24],[13,14,15,24],[4,14,15,24]]]
        ]),
    };

    rotateClick = ()=>{
        const runLette = this.props.runLette;
        const posRotateMap = this.state.posMap.get(runLette);
        const rotateNum = this.props.rotateNum+1>=posRotateMap.length? 0:this.props.rotateNum+1;
        
        const preRotatePos = posRotateMap[this.props.rotateNum]
        const newInitPos = posRotateMap[rotateNum];
        
        console.log(preRotatePos);
        this.props.rotate(preRotatePos,newInitPos,rotateNum);
        console.log("rotate");

    }



    render (){
        return (
            <div key="185" className="rotateKey">
                <button key={this.state.id} onClick={this.rotateClick}> Rotate </button>
            </div>
        )
    }
}