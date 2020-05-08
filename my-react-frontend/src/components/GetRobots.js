import React, { useState, useEffect } from 'react'
import axios from 'axios' 
import { CardGroup } from 'react-bootstrap'
import './GetRobots.css'
import RobotCard from './RobotCard'

export default function GetRobots() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [robots, setRobots] = useState([]);

    async function getRobots(url) {
      try {
        const response = await axios.get(url);
        // console.log(response.data);
        setRobots(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error)
        // console.error(error)
        setIsLoading(false)
      }
    }    
 
    useEffect(() => {
      getRobots(process.env.REACT_APP_URL + '/posts')
    }, [])

    if (isLoading) {
      return (
        <div>
          <h3> Page is loading .....</h3> 
        </div>
      )
    } else {
      if (error == null) {
        return (
          <div>
            <CardGroup className="myRobotCardGroup">
              {
                // robots.map(robot => <li key={robot.id}>{robot.title}</li>)
                robots.map(robot => 
                  <RobotCard title={robot.title} body={robot.body} />
                )
              }
            </CardGroup>
          </div>
        )
      } else {
        return (
          <div>
            <h3>{error.message}</h3>
          </div>
        )
      }
    }
}