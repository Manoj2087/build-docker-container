import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import './Home.css'
import RobotButton from '../components/RobotButton'


export default function Home() {
    return (
        <div className="siteBG">
            <Jumbotron className="myJumbotron" fluid>
                <h3>Welcome Scientists !! We sell a wide range of robots, for both you good and evil needs.</h3>
            </Jumbotron>
            <Container>
                <Row className="row">
                    <Col className="colHome" lg={4}>
                    <Image src='/images/home350x350.png' />
                    {/* <h2>Welcome Scientists<br />We sell a wide range of<br />robots for you.</h2> */}
                    </Col>
                    <Col className="colButton" lg={4}>
                    <RobotButton 
                        type="good"
                    />
                    </Col>
                    <Col className="colButton" lg={4}>
                    <RobotButton 
                        type="bad"
                    />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
