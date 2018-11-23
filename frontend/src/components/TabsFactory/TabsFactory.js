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
import ViewCart from '../useCaseComponents/ViewCatalogue/ViewCart.js';
import ViewLoans from '../useCaseComponents/ViewCatalogue/ViewLoans.js';
import AddBook from "../useCaseComponents/ViewCatalogue/AddBook";
import AddMagazine from "../useCaseComponents/ViewCatalogue/AddMagazine";
import AddMovie from "../useCaseComponents/ViewCatalogue/AddMovie";
import AddMusic from "../useCaseComponents/ViewCatalogue/AddMusic";
import Loans from "../useCaseComponents/Loans.js";

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
                            <Tab>View Loans</Tab>
                            <Tab>View Library Items</Tab>
                            <Tab>Add Library Items</Tab>
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
                            <Loans app={app} is_admin={1} />
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
                                <ViewBooks app={app} is_admin={1} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMagazines app={app} is_admin={1} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMovies app={app} is_admin={1} />
                            </TabPanel>
                            <TabPanel>
                                <ViewMusics app={app} is_admin={1} />
                            </TabPanel>
                            </Tabs>
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
                                    <AddBook app={app} />
                                </TabPanel>
                                <TabPanel>
                                    <AddMagazine app={app} />
                                </TabPanel>
                                <TabPanel>
                                    <AddMovie app={app} />
                                </TabPanel>
                                <TabPanel>
                                    <AddMusic app={app} />
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
                            <Tab>Browse Catalogue</Tab>
                            <Tab>My Cart</Tab>
                            <Tab>My Loans</Tab>
                            <Tab>Logout</Tab>
                        </TabList>
                        <TabPanel>
                            <Tabs>
                                <TabList>
                                    <Tab>Books</Tab>
                                    <Tab>Magazines</Tab>
                                    <Tab>Movies</Tab>
                                    <Tab>Music</Tab>
                                </TabList>
                                <TabPanel>
                                    <ViewBooks app={app} is_admin={0} />
                                </TabPanel>
                                <TabPanel>
                                    <ViewMagazines app={app} is_admin={0} />
                                </TabPanel>
                                <TabPanel>
                                    <ViewMovies app={app} is_admin={0} />
                                </TabPanel>
                                <TabPanel>
                                    <ViewMusics app={app} is_admin={0} />
                                </TabPanel>
                            </Tabs>
                        </TabPanel>
                        <TabPanel>
                            <ViewCart app={app} is_admin={0} />
                        </TabPanel>
                        <TabPanel>
                            <ViewLoans app={app} is_admin={0} />
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