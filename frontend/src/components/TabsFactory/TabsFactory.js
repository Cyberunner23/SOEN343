import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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
                            <Tab>Register</Tab>
                        </TabList>
                        <TabPanel>
                            Login Component
                        </TabPanel>
                        <TabPanel>
                            Register Component
                        </TabPanel>
                    </Tabs>
                )
    
            case TabsState.Admin:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Register Admin</Tab>
                            <Tab>View Active Users</Tab>
                        </TabList>
                        <TabPanel>
                            Register Admin Component
                        </TabPanel>
                        <TabPanel>
                            View Active Users Component
                        </TabPanel>
                    </Tabs>
                )
    
            case TabsState.Client:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Oops!</Tab>
                        </TabList>
                        <TabPanel>
                            Oops! Nothing to see here...
                        </TabPanel>
                    </Tabs>
                )

            default:
                return 'Oops! Invalid TabsState';
        }
    }
}

export {TabsState, TabsFactory};