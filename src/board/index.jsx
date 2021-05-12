import './index.css';
import React from 'react';
import {nanoid} from 'nanoid';
import Move from './Move/index';
import Rotate from './Rotate/index';

export default class Board extends React.Component {
    state = {
        squareState:Array(180).fill(false),
        letterClass:['O','I','Z','L','J','T'],
        posNumInit:[[5,6,15,16],[13,14,15,16],[4,5,15,16],[5,13,14,15],[3,13,14,15],[4,13,14,15]],
        runLette:'',
        rotateNum:0,
        pos:[],
        id:Array(180).fill(1).map(()=>nanoid()),
        spark:{flag:true,num:0},
        loopTime:200,
    };

// [[3,4,5,15],[4,5,15,25],[4,5,15,25]]
    componentDidMount() {
        this.getNew();
        // this.timer0 = setInterval(()=>this.tick(),this.state.loopTime);
        document.addEventListener("keydown", this.KeyDown);
    }

    componentWillUnmount() {
       // clearInterval(this.timer0);
        document.removeEventListener("keydown", this.KeyDown);
    }

    KeyDown=(event)=>{
        const rotateEvent = this.refs.rotateEvent;

        switch(event.keyCode){
            case 37:this.move(-1);break;
            case 38:rotateEvent.rotateClick();break;
            case 39:this.move(1);break;
            case 32:this.fastDown();break;
        }

        console.log(event.keyCode);
    }

    //快速下落
    fastDown=()=>{
        clearInterval(this.timer0);
        this.timer1 = setInterval(()=>{
            this.tick();
        },1);
    }

    //获得新块开始下落
    getNew(){
        const posNumInit = this.state.posNumInit;
        const letterClass = this.state.letterClass;
        const runNum = Math.floor(Math.random()*(posNumInit.length));
        //const runNum = 0;
        clearInterval(this.timer1);
        clearInterval(this.timer0);
        this.timer0 = setInterval(()=>this.tick(),this.state.loopTime);
        this.setState({loopTime:500,rotateNum:0,runLette:letterClass[runNum],pos:posNumInit[runNum]});

    }


    //mode:0下降，1左右移动
    changestate(prepos,newpos,mode) {
        let statePos = this.state.squareState; //使用let应该是有争议的***/
        let flagBounds = true;
        //运动边界判断

        for(let i of newpos){
            if(i >statePos.length-1||((prepos.indexOf(i)===-1)&&statePos[i])){
                //需要停止运动并开始下一块运动
                flagBounds = false;
             //   clearInterval(this.timer0);
                break;
            }
        }
        if(flagBounds){
        //运动位置更新
            for(let i of prepos){
                //清空上次运动状态
                statePos[i]=false;
            }     
            for(let i of newpos){
                //更新运动位置
                statePos[i]=true;
            }                     
            this.setState({squareState:statePos, pos:newpos});
        }else{
            if(mode === 0){
                if(this.compareDis())
                //开始下一轮移动
                this.getNew();
            }
        }
    }

    //判断是否有一行消除
    compareDis = ()=>{
        const statePos = this.state.squareState;
        //判断是否有一行消除
        const rowDisMap = [];
        for(let i=0;i<statePos.length/10;i++){
            //获取成行的位置
            let len=0;
            for(let j=0;j<10;j++){
                if(statePos[10*i+j]){
                    len++;
                }else{
                    len--;
                }
            }
            if(len === 10){
                rowDisMap.push(i);
            }
        }
        if(rowDisMap.length !== 0){
            clearInterval(this.timer0);
            clearInterval(this.timer1);
            const  blingMap = statePos.map((v,k)=>{
                if(rowDisMap.indexOf(Math.floor(k/10)) !== -1){
                    return true;
                }else{
                    return v;
                }
            });

            const  darkMap = statePos.map((v,k)=>{
                if(rowDisMap.indexOf(Math.floor(k/10)) !== -1){
                    return false;
                }else{
                    return v;
                }
            });
            const rowCom = [];
            for(let i=0;i<statePos.length/10;i++){
                if(rowDisMap.indexOf(i) === -1){
                    rowCom.push(i);
                }
            }
            for(let i=0;i<rowDisMap.length;i++){
                rowCom.splice(0,0,-1);
            }

            //未消除的方块位置
            const newDisPos = darkMap.map((v,k)=>{
                const row = Math.floor(k/10);

                if(rowCom[row] === -1){
                    return false;
                }else{
                    return statePos[rowCom[row]*10+k%10];
                }
                
                //return statePos[k-rowCom*10]
                //return v;
            });

            console.log(rowDisMap);


            this.timer2  = setInterval(()=>{
                const sparkflag = this.state.spark.flag;
                const sparknum = this.state.spark.num;                
                if(sparkflag) {
                    this.setState({spark:{flag:false,num:sparknum+1},squareState:blingMap});
                }else{
                    this.setState({spark:{flag:true,num:sparknum+1},squareState:darkMap});
                }

                if(sparknum == 4){
                    this.setState({spark:{flag:true,num:0},squareState:newDisPos});
                    clearInterval(this.timer2);
                    this.timer0 = setInterval(()=>this.tick(),this.state.loopTime);
                }
            },200);
            return false;
        }else{
            return true;
        }
    }

    tick (){
        //计算状态
        const pos0 = this.state.pos;
        const newpos = pos0.map((v)=>v+10);
        this.changestate(pos0,newpos,0);
    }
    // move
    move = (dir)=>{
        //获取当前位置
        const pos0 = this.state.pos;
        //判断是否移动
        let flag = true;
        for(let i of pos0){
            if(dir===1&&i%10 === 9){
                flag  = false;
            } 
            if(dir===-1&&i%10 === 0){
                flag  = false;
            }             
        }
        //计算移动后的位置
        if(flag){
            const posMove = pos0.map((v)=>v+dir); 
            //更新运动位置
            this.changestate(pos0,posMove,1);
        }        
    }

    //rotate
    rotate = (preRotatePos,rotatePos,rotatenum)=>{
        const pos0 = this.state.pos;
        const posdeta = pos0.map((v,k)=>{
            v=v-preRotatePos[k];
            return v;
        })
        
        const newRotatePos = posdeta.map((v,k)=>{
            v=v+rotatePos[k];
            return v;
        });
        console.log(newRotatePos);
        //判断是否移动
        let flag = true;
        for(let i of newRotatePos){
            if(i%10 === 9||i%10 === 0){
                flag  = false;
            } 
    
        }
        //计算移动后的位置
        if(flag){
            //更新运动位置
            this.setState({rotateNum:rotatenum});
            this.changestate(pos0,newRotatePos,2);            
        }    


    }

    render() {
        return (
        <div key="183"  className="board">
            <ul key="181" className="board0">
                <li key="182" className="row">
                    {
                        this.state.squareState.map((v,i)=> <div key = {this.state.id[i]} className={v? "squareClick":"square"} ></div>)
                    }
                
                </li>    
            </ul>

            <Move move={this.move}/>
            <Rotate ref="rotateEvent" runLette={this.state.runLette} rotateNum={this.state.rotateNum} rotate={this.rotate}/>               
        </div>     
        )
    }
}
