import React from 'react'
import './RobotButton.css'
import Button from 'react-bootstrap/Button'

export default function RobotButton({
    type, ...restProp
}) {
    return (
        <div>
            <Button className={type + 'Robot'}></Button>
        </div>
    )
}
