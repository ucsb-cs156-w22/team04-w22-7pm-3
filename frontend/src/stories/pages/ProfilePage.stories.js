
import React from 'react';

import ProfilePage from "main/pages/ProfilePage";
import {threeUsers} from "fixtures/usersFixtures"

export default {
    title: 'pages/ProfilePage',
    component: ProfilePage
};

const Template = () => <ProfilePage />;

export const Default = Template.bind({});



<Canvas>
  <Story name="No User">
    
    <ProfilePage />
  </Story>

  <Story name="Phill Conrad">
    <ProfilePage profile = {threeUsers[0]} />
  </Story>
</Canvas>
