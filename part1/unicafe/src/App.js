import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  if (props.text === 'average') {
    return (
      <tr>
        <td>average</td> 
        <td>{ (props.v1 - props.v3) / (props.v1 + props.v2 + props.v3) }</td>
      </tr>
    )
  }

  if (props.text === 'positive') {
    return (
      <tr>
        <td>positive</td>
        <td>{ 100 * props.v1 / (props.v1 + props.v2 + props.v3) } %</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )

}

const Statistics = (props) => {
  console.log(props)
  
  if (props.v1 === 0 && props.v2 === 0 && props.v3 === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  
  return (
    <table>
      <tbody>
        <StatisticLine text={props.t1} value={props.v1}/>
        <StatisticLine text={props.t2} value={props.v2}/>
        <StatisticLine text={props.t3} value={props.v3}/>
        <StatisticLine text='all' value={props.v1 + props.v2 + props.v3}/>
        <StatisticLine text='average' v1={props.v1} v2={props.v2} v3={props.v3} />
        <StatisticLine text='positive' v1={props.v1} v2={props.v2} v3={props.v3} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => {setGood(good + 1)}
  const incrementNeutral = () => {setNeutral(neutral + 1)}
  const incrementBad = () => {setBad(bad + 1)}

  return (
    <div>
      <Header text='give feedback'/>
      <Button 
        handleClick={incrementGood}
        text='good'
      />
      <Button 
        handleClick={incrementNeutral}
        text='neutral'
      />
      <Button 
        handleClick={incrementBad}
        text='bad'
      />

      <Header text='statistics'/>
      <Statistics
        t1='good'
        t2='neutral'
        t3='bad'
        v1={good}
        v2={neutral}
        v3={bad}
      />

      
    </div>
  )
}

export default App
