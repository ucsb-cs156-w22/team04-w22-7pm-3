import React from "react";
import { Card, _Image, Button, Row, Col} from "react-bootstrap";
import cowhead from 'assets/CowHead.png';

// add parameters 
const ManageCows = ({userCommons, commons, onBuy, onSell}) =>  {
    // update cowPrice from fixture
    return (
        <Card>
        <Card.Header as="h5">Manage Cows</Card.Header>
        <Card.Body>
            {/* change $10 to info from fixture */}
            <Card.Title>Market Cow Price: ${commons?.cowPrice}</Card.Title> 
            <Card.Title>Selling Price : ${parseInt(commons?.cowPrice * 0.8 * userCommons?.avgCowHealth / 100, 10)}</Card.Title>
            <Card.Title>Milk Price : ${commons?.milkPrice}</Card.Title>
                <Row>
                    <Col>
                        <Card.Text>
                            <img src={cowhead} alt="Cowhead" /> 
                        </Card.Text>
                    </Col>
                </Row>
                &nbsp;
                <Row>
                    <Button variant="outline-danger" onClick={()=>{onBuy(userCommons)}} data-testid={"buy-cow-button"}>Buy</Button> &nbsp; <Button variant="outline-danger" onClick={()=>{onSell(userCommons)}} data-testid={"sell-cow-button"}>Sell</Button>
                </Row>
        
                    Note: Selling price = market cow price * weight factor(0.8) * average cow health (as a percentage).

        </Card.Body>
        </Card>
    ); 
}; 

export default ManageCows; 