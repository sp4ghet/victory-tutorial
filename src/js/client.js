import React from 'react';
import ReactDOM from 'react-dom';
import {VictoryLegend, VictoryLine, VictoryChart, VictoryTheme, VictoryArea, VictoryGroup} from 'victory'
import data from './data'

const toXY = (arr) => {
  let reg = arr.length - 1
  return arr.map((y, i) => ({x: i/reg, y:y}))
}

const zip = (xs,ys) => {
  return xs.map((x,i) => ({x: x, y: ys[i]}))
}

class Main extends React.Component {
  render() {
    const box = this.props.box

    let externalEventMutations = undefined

    const removeMutation = () => {
      externalEventMutations = undefined
    }

    const clearAndHighlight = (props) => {
      externalEventMutations = [
        {
          childName: "legend",
          target: ["data"],
          eventKey: "all",
          mutation: Object.assign(props, {style:
            (() => {let s = props.style; s.opacity = 1; return s})()
          }),
          callback: removeMutation
        }
      ]
      return Object.assign(props, {style:
        (() => {let s = props.style; s.opacity = 0.1; return s})()
      })
    }

    const eventNames = box.concat([{name: 'legend'}])

    const eventHandler = eventNames.map(x => ({
      target: "data"
      ,childName: x.name
      ,eventHandlers: {
        onMouseOver: () => ({
          target: "data"
          ,mutation: clearAndHighlight
        })
      }
    }))

    const theme = VictoryTheme.material
    theme.axis.style.axis.strokeWidth = 0.1
    return (
      <div className="graph">
        <VictoryChart
        theme={theme}
        domain={{x: [-0.1, 1.1], y: [-0.1, 1.1]}}
        events={eventHandler}
        externalEventMutations={externalEventMutations}
        >
          <VictoryLegend x={125} y={10}
            name="legend"
            orientation="horizontal"
            gutter={20}
            style={{ border: { stroke: "black" } }}
            colorScale={box.map(x => x.color)}
            data={box.map(x => ({name: x.name}))}
          />
          {box.map(d => (
            <VictoryLine
              name={d.name}
              style={{data: {
                stroke: d.color
                ,strokeWidth: 3 }
              }}
              data={d.data}
              x="x"
              y="y"
            />
          ))}
        </VictoryChart>
      </div>
    )
  }
}

const keys = [0,1,2, "micro", "macro"]
const datas = []
for (let i of keys){
  let d = zip(data.fpr[`${i}`], data.tpr[i])
  datas.push(d)
}

const strokes = [
  "#628395"
  ,"#04151F"
  ,"#C44900"
  ,"#575C55"
  ,"#ACC12F"
]

const box = [...Array(5).keys()].map((_, i) => ({
  data: datas[i]
  ,color: strokes[i]
  ,name: `label${keys[i]}`
}))



const app = document.getElementById('app');
ReactDOM.render(<Main box={box} />, app);
