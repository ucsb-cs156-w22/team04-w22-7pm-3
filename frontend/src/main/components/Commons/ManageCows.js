import React from "react";
import { Card, _Image, Button, Row, Col} from "react-bootstrap";
import cowhead from 'assets/CowHead.png';

// add parameters 
const ManageCows = ({userCommons, onBuy, onSell}) =>  {
    // update cowPrice from fixture
    return (
        <Card>
        <Card.Header as="h5">Manage Cows</Card.Header>
        <Card.Body>
            {/* change $10 to info from fixture */}
            <Card.Title>Market Cow Price: ${userCommons?.commons?.cowPrice}</Card.Title>
           
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
        
                    Note: Selling price is current market cow price times the health of that cow (as a percentage).

        </Card.Body>
        </Card>
    ); 
}; 

export default ManageCows; 