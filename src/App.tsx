import React, { useEffect, useState } from 'react'
import awsCronParser from "aws-cron-parser"
import './App.css'

function App() {
  const [expression, setExpression] = useState<string>('* * * * * *')
  const [occuranceLength, setOccuranceLength] = useState<number>(10)
  const [occurances, setOccurances] = useState<(Date | null)[]>()
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setInvalid(false)
    setOccurances(undefined)
    if (expression) {
      try {
        const cron = awsCronParser.parse(expression)

        setOccurances(
          new Array(occuranceLength || 1)
            .fill(undefined)
            .reduce((acc, _, index) => [...acc, awsCronParser.next(cron, index === 0 ? new Date() : acc[index - 1])], [])
        )
      } catch {
        setInvalid(true)
      }
    }
  }, [expression, occuranceLength])

  return (
    <div className='container'>
      <h1>AWS Cron Expression Tester</h1>

      <label htmlFor="occuranceLength">Occurances</label>
      <div className='slidecontainer'>
        <input className='slider' type="range" min={1} max={50} name="occuranceLength" value={occuranceLength} onChange={e => setOccuranceLength(parseInt(e.target.value))} />
      </div>
      <span title="">{occuranceLength}</span>
      <br />

      <label htmlFor="expression">Expression</label>
      <input type='text' name="expression" value={expression} onChange={e => setExpression(e.target.value)} />
      <br />

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Values</th>
            <th>Wildcards</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minutes</td>
            <td>0-59</td>
            <td>, - * /</td>
          </tr>
          <tr>
            <td>Hours</td>
            <td>0-23</td>
            <td>, - * /</td>
          </tr>
          <tr>
            <td>Day-of-month</td>
            <td>1-31</td>
            <td>, - * ? / L W</td>
          </tr>
          <tr>
            <td>Month</td>
            <td>1-12 or JAN-DEC</td>
            <td>, - * /</td>
          </tr>
          <tr>
            <td>Day-of-week</td>
            <td>1-7 or SUN-SAT</td>
            <td>, - * ? L #</td>
          </tr>
          <tr>
            <td>Year</td>
            <td>1970-2199</td>
            <td>, - * /</td>
          </tr>
        </tbody>
      </table>

      <br />

      <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions">AWS Cron Reference</a>

      <br /><br />

      <div className='result-card'>
        {occurances?.map((d, i) => <p key={i}>{d?.toString()}</p>)}
      </div>

      <p>Frontend for <a href="https://github.com/beemhq/aws-cron-parser">aws-cron-parser</a></p>
    </div>
  );
}

export default App;
