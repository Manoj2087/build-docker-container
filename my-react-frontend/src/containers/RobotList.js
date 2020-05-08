import React from 'react'
import { useParams } from 'react-router-dom'
import './RobotList.css'
import APIFetch from '../components/GetRobots'

export default function RobotList() {
    const { robotType } = useParams()
    console.log(robotType)

    return (
        <div className="robotList">
            <h4> List of {robotType} Robots</h4>
            <APIFetch />
        </div>
    )
}
