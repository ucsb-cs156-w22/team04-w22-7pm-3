import React from 'react';

import ProfitsTable from "main/components/Commons/ProfitsTable";
import profitsFixtures from 'fixtures/profitsFixtures';

export default {
    title: 'components/Commons/ProfitsTable',
    component: ProfitsTable
};

const Template = (args) => {
    return (
        <ProfitsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    profits: []
};

export const threeProfits = Template.bind({});
threeProfits.args = {
    profits: profitsFixtures.threeProfits
};