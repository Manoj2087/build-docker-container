import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import './RobotCard.css'

export default function RobotCard(props) {
    return (
        <div>
            <Card className="myCard" style={{width:'20rem'}}>
            <Card.Img 
                variant="top" 
                src="/images/gbot1_100x180.png" 
            />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {/* <Card.Text>
                {props.body}
                </Card.Text> */}
                    <Card.Footer>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Footer>                
            </Card.Body>
            </Card>
        </div>
    )
}
