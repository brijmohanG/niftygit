import React, {Component} from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
  } from "recharts"
  import "./index.css"

class Graph extends Component{
state = {Data:[], strikePrice: "",totalSellQuantityCE:"",totalSellQuantityPE:"",totalChangeInOiCE:"",totalChangeInOiPE:""}


// https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY
// https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY

fetchData = async()=> {
    const {strikePrice} = this.state
    const url = "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY"
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application.json",
            "Accept": "application.json"
        }
    }
    const response = await fetch(url,options)
    const data = await response.json()
    console.log(data)
    const newdata = data["records"]["data"]
    const newdataCE = []
    const newdataPE = []
    for (let i of newdata){
        newdataCE.push(i["CE"])
    }
    for (let j of newdata){
        newdataPE.push(j["PE"])
    }
    
    const upperStrikePrice = parseInt(strikePrice)+100
    const lowerStrikePrice = parseInt(strikePrice)-100

    const filterCe = newdataCE.filter(eachItem=>eachItem !== undefined)
    const newFilterCe = []
    for (let i of filterCe){
        if (i.strikePrice <= upperStrikePrice && i.strikePrice >= lowerStrikePrice){
            newFilterCe.push(i)
        }
    }
    // console.log(newFilterCe) changeinOpenInterest

    let totalSellQuantityCe = 0
    let totalChangeinoiCe = 0
    for (let j of newFilterCe){
        totalSellQuantityCe = totalSellQuantityCe+ j.totalSellQuantity
        totalChangeinoiCe = totalChangeinoiCe + j.changeinOpenInterest
    }
    this.setState({totalSellQuantityCE:totalSellQuantityCe,totalChangeInOiCE:totalChangeinoiCe})


    const filterPe = newdataPE.filter(eachItem=>eachItem!== undefined)
    const newFilterPe = []
    for (let i of filterPe){
        if (i.strikePrice <= upperStrikePrice && i.strikePrice >= lowerStrikePrice){
            newFilterPe.push(i)
        }
    }
    let totalSellQuantityPe = 0
    let totalChangeinoiPe = 0
    for (let j of newFilterPe){
        totalSellQuantityPe = totalSellQuantityPe+ j.totalSellQuantity
        totalChangeinoiPe = totalChangeinoiPe + j.changeinOpenInterest
    }
    this.setState({totalSellQuantityPE:totalSellQuantityPe,totalChangeInOiPE:totalChangeinoiPe})
    

}

inputStrike = (event) => {
    const value = event.target.value
    this.setState({strikePrice:value})

}

addValue=()=>{
    setInterval(this.fetchData,3000)
}

    render(){
        const {strikePrice,totalSellQuantityCE,totalSellQuantityPE,totalChangeInOiCE,totalChangeInOiPE} = this.state
        
        const data = [{"Call":totalSellQuantityCE,"Put":totalSellQuantityPE}]
        const data2 = [{"Call":totalChangeInOiCE,"Put":totalChangeInOiPE}]
        console.log(totalChangeInOiCE)
        const DataFormatter = (number) => {
            if (number > 1000) {
              return `${(number / 1000).toString()}k`
            }
            return number.toString()
          }
        return(
            <div className="bg-container">
                <div className="App">
                        <input type="text" onChange={this.inputStrike} value={strikePrice} placeholder="Enter strikePrice" className="input"/>
                        <button type="button" onClick={this.addValue} className="add-button">Add</button>
                </div>
                <div className="graph-container">
                    <div className="App-container">
                        <h1>Total Selling</h1>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={data}
                                margin={{
                                top: 5,
                                }}
                            >
                            <XAxis
                                dataKey="group_name"
                                tick={{
                                stroke: "gray",
                                strokeWidth: 1,
                                }}
                            />
                            <YAxis
                                tickFormatter={DataFormatter}
                                tick={{
                                stroke: "gray",
                                strokeWidth: 0,
                                }}
                                />
                            <Legend
                                wrapperStyle={{
                                padding: 10,
                                }}
                                />
                            <Bar dataKey="Call" name="Call" fill="#17F50C" barSize="40%" />
                            <Bar dataKey="Put" name="Put" fill="#F51E0C" barSize="40%" />
                        </BarChart>
                        </ResponsiveContainer>
                </div>
                <div>
                    <h1>Change In Oi</h1>
                    <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={data2}
                                margin={{
                                top: 5,
                                }}
                            >
                            <XAxis
                                dataKey="group_name"
                                tick={{
                                stroke: "gray",
                                strokeWidth: 1,
                                }}
                            />
                                <YAxis
                                tickFormatter={DataFormatter}
                                tick={{
                                stroke: "gray",
                                strokeWidth: 0,
                                }}
                                />
                                <Legend
                                wrapperStyle={{
                                padding: 10,
                                }}
                                />
                                <Bar dataKey="Call" name="Call" fill="#17F50C" barSize="10%" />
                                <Bar dataKey="Put" name="Put" fill="#F51E0C" barSize="10%" />
                            </BarChart>
                        </ResponsiveContainer>
                </div>
            </div>
          </div>
        )
    }
}

export default Graph

    // <div>
            //     <input type="text" onChange={this.inputStrike} value={strikePrice}/>
            //     <input type="date"/>
            //     <button type="button" onClick={this.addValue}>Add</button>
              // </div>