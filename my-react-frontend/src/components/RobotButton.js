import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import './RobotButton.css'

export default function RobotButton({
    type
}) {
    const history = useHistory()

    function onClickHandle() {
        // console.log(type)
        history.push("/robotlist/" + type);
    }

    return (
        <div>
            <Button 
                className={type + 'Robot'} 
                onClick={onClickHandle}
            />
        </div>
    )
}
