
import React from 'react';
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ProfilePage from "main/pages/ProfilePage";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";

export default {
    title: 'pages/ProfilePage',
    component: ProfilePage,
};


const Template = () => <ProfilePage />;

export const Default = Template.bind({});


export const User = Template.bind({});
const axiosMock = new AxiosMockAdapter(axios)
// User.parameters = {
//     axios: [
//         axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly)
//       ],
// };



{/* <Canvas>
  <Story name="No User">
    
    <ProfilePage />
  </Story>

  <Story name="Phill Conrad">
    <ProfilePage profile = {threeUsers[0]} />
  </Story>
</Canvas> */}
