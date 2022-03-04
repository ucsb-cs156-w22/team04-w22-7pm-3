import React from 'react';

import AdminDisplayTable from "main/components/Commons/AdminDisplayTable";
import { adminDisplayFixtures } from 'fixtures/adminDisplayTableFixtures';

export default {
    title: 'components/Commons/AdminDisplayTableTable',
    component: AdminDisplayTable
};

const Template = (args) => {
    return (
        <AdminDisplayTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    admins: []
};

export const threeAdmins = Template.bind({});
threeAdmins.args = {
    admins: adminDisplayFixtures.threeAdmins
};

// export const oneAdmin = Template.bind({});

// oneAdmin.args = {
//     admins: adminDisplayFixtures.oneAdmin
// };