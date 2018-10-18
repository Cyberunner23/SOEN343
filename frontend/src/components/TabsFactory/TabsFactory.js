import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Login from '../useCaseComponents/Login'
import './TabsFactory.css'
import ActiveUsers from '../useCaseComponents/ActiveUsers.js';
import Logout from '../useCaseComponents/Logout.js';
import Register from '../useCaseComponents/Register.js';
import ViewBooks from '../useCaseComponents/ViewCatalogue/ViewBooks.js';
import ViewMagazines from '../useCaseComponents/ViewCatalogue/ViewMagazines.js';
import ViewMovies from '../useCaseComponents/ViewCatalogue/ViewMovies.js';
import ViewMusics from '../useCaseComponents/ViewCatalogue/ViewMusics.js';

var TabsState = Object.freeze({ 'Welcome': 0, 'Admin': 1, 'Client': 2 });

class TabsFactory {
    static buildTabs(tabsState, app) { // a reference to app can be used by components to call app.setTabsState()
        switch (tabsState) {
            case TabsState.Welcome:
                return (
                    <Tabs>
                        <TabList>
                            <Tab>Login</Tab>
                        </TabList>
                        <TabPanel>
                            <Login app={app} />
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
                            <Tab>View Library Items</Tab>
                            <Tab>Logout</Tab>
                        </TabList>
                        <TabPanel>
                            <Register app={app} is_admin={1} />
                        </TabPanel>
                        <TabPanel>
                            <Register app={app} is_admin={0} />
                        </TabPanel>
                        <TabPanel>
                            <ActiveUsers app={app} />
                        </TabPanel>
                        <TabPanel>
                            <Tabs>
                                <TabList>
                                    <Tab>Books</Tab>
                                    <Tab>Magazines</Tab>
                                    <Tab>Movies</Tab>
                                    <Tab>Music</Tab>
                                </TabList>
                            <TabPanel>
                                <ViewBooks app={app} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMagazines app={app} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMovies app={app} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMusics app={app} />
                            </TabPanel>
                            </Tabs>
                        </TabPanel>
                        <TabPanel>
                            <Logout app={app} />
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
                            <Logout app={app} />
                        </TabPanel>
                    </Tabs>
                )

            default:
                return 'Oops! Invalid TabsState';
        }
    }
}

export { TabsState, TabsFactory };