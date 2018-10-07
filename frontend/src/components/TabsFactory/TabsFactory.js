import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Login from '../useCaseComponents/Login'
import './TabsFactory.css'
import ActiveUsers from '../useCaseComponents/ActiveUsers.js';
import Logout from '../useCaseComponents/Logout.js';
import Register from '../useCaseComponents/Register.js';

var TabsState = Object.freeze({'Welcome' : 0, 'Admin' : 1, 'Client' : 2});

class TabsFactory {
    static buildTabs(tabsState, app) { // a reference to app can be used by components to call app.setTabsState()
        switch(tabsState)
        {
            case TabsState.Welcome:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Login</Tab>
                        </TabList>
                        <TabPanel>
                            <Login app = {app} />
                        </TabPanel>
                    </Tabs>
                )
    
            case TabsState.Admin:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Register Admin</Tab>
                            <Tab>Register User</Tab>
                            <Tab>View Active Users</Tab>
                            <Tab>Logout</Tab>
                        </TabList>
                        <TabPanel>
                            <Register app = {app} is_admin = {1}/>
                        </TabPanel>
                        <TabPanel>
                            <Register app = {app} is_admin = {0}/>
                        </TabPanel>
                        <TabPanel>
                            <ActiveUsers app = {this}/>
                        </TabPanel>
                        <TabPanel>
                            <Logout app = {app}/>
                        </TabPanel>
                    </Tabs>
                )
    
            case TabsState.Client:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Oops!</Tab>
                            <Tab>Logout</Tab>
                        </TabList>
                        <TabPanel>
                            Oops! Nothing to see here...
                        </TabPanel>
                        <TabPanel>
                            <Logout app = {app}/>
                        </TabPanel>
                    </Tabs>
                )

            default:
                return 'Oops! Invalid TabsState';
        }
    }
}

export {TabsState, TabsFactory};