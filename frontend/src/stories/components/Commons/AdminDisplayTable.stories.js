import React from 'react';

import CommonsTable from "main/components/Commons/CommonsTable";
import commonsFixtures from 'fixtures/commonsFixtures';

export default {
    title: 'components/Commons/CommonsTable',
    component: CommonsTable
};

const Template = (args) => {
    return (
        <CommonsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    commons: []
};

export const threeCommons = Template.bind({});
threeCommons.args = {
    commons: commonsFixtures.threeCommons
};

