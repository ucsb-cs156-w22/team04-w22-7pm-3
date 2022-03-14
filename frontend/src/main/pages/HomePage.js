import React, { useState, useEffect } from "react"
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsList from "main/components/Commons/CommonsList";
import { Container, Row, Col } from "react-bootstrap";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import { useNavigate } from "react-router-dom";
import Background from './../../assets/HomePageBackground.jpg';

import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useQueryClient } from "react-query";

export default function HomePage() {
  const [commons, setCommons] = useState([]);
  const [commonsJoined, setCommonsJoined] = useState([]);
  const { data: currentUser } = useCurrentUser();

  const queryClient = useQueryClient();

  const { data: commonsFromBackend, error: commonsError, status: commonsStatus } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/commons/all"],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/commons/all"
      }
    );

  const objectToAxiosParams = (newCommonsId) => ({
    url: "/api/commons/join",
    method: "POST",
    params: {
      commonsId: newCommonsId
    }
  });

  const mutation = useBackendMutation(
    objectToAxiosParams,
    {  },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/currentUser"]
  );

  useEffect(
    () => {
      if (currentUser?.root?.user?.commons) {
        setCommonsJoined(currentUser.root.user.commons);
      }
    }, [currentUser]
  );

  useEffect(
    () => {
      if (commonsFromBackend) {
        setCommons(commonsFromBackend);
      }
    }, [commonsFromBackend]
  );

  let navigate = useNavigate();
  const visitButtonClick = (id) => { navigate("/play/" + id) };

  if(hasRole(currentUser, "ROLE_USER") || hasRole(currentUser, "ROLE_ADMIN")){
    return (
      <div style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
        <BasicLayout>
          <h1 data-testid="homePage-title" style={{ fontSize: "75px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">Howdy Farmer</h1>
          <Container>
            <Row>
              <Col sm><CommonsList commonList={commonsJoined} buttonText={"Visit"} buttonLink={visitButtonClick} /></Col>
              <Col sm><CommonsList commonList={commons} buttonText={"Join"} buttonLink={mutation.mutate} /></Col>
            </Row>
          </Container>
        </BasicLayout>
      </div>
    )
  }else{
    return (
      <div style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
        <BasicLayout>
          <h1 data-testid="homePage-title" style={{ fontSize: "75px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">Howdy Farmer</h1>
          <h1 style={{ fontSize: "40px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">Log in to participate in Happier Cows!</h1>
          <h1 style={{ fontSize: "20px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">W22-7pm-3: Xiyue Wang, Chase Alcorn, Issac Chin, Thomas Hale, Steven Choi, Michael Glushchenko</h1>
          <h1 style={{ fontSize: "20px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">W22-7pm-4: Allison Huang, Elizabeth Armstrong, Olivia Gillam, Ryan Wenger, Simon Yu, Vicky Zhou</h1>
        </BasicLayout>
      </div>
    )
  }
}