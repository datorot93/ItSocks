import React from 'react';
import { Admin, Resource } from 'react-admin';
import { createBrowserHistory as createHistory } from 'history';
import { Layout } from 'react-admin';
import './App.css'; // Importa el archivo CSS

const MyLayout = (props) => <Layout {...props} className="layout" />;

const App = () => (
    <Admin layout={MyLayout} history={createHistory()}>
        {/* ...existing code... */}
    </Admin>
);

export default App;
