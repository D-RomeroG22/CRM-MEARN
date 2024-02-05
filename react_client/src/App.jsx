import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import AuthBlock from "./components/AuthBlock";
import NaviComponent from "./components/NaviComponent";
import Overview from "./components/Overview";
import Categories from "./components/CategoryComponent/Categories";
import Analytics from "./components/Analytics";
import Profile from "./components/Profile";
import History from "./components/HistoryComponent/History";
import MailingSchemas from "./components/MailingSchemasComponent/MailingSchemas";
import MailingSchemaForm from "./components/MailingSchemasComponent/MailingSchemaForm";
import CategoryForm from "./components/CategoryComponent/CategoryForm";
import Order from "./components/OrderComponent/Order";
import OrderOptions from "./components/OrderComponent/OrderOptions";

const ROLES = {
  User: "user",
  Editor: "editor",
  Admin: "admin",
};

const PUBLIC = [
  {
    path: '/',
    component: <Login />
  },
  {
    path: 'login',
    component: <Login />
  },
  {
    path: 'register',
    component: <Register />
  }
];

const PROTECT = [
  {
    path: '/',
    component: localStorage.getItem('authToken') ? <Overview /> : <Login />
  },
  {
    path: 'overview',
    component: <Overview />
  },
  {
    path: 'analytics',
    component: <Analytics />
  },
  {
    path: 'emails',
    component: <MailingSchemas />
  },
  {
    path: 'emails/:id',
    component: <MailingSchemaForm />
  },
  {
    path: 'history',
    component: <History />
  },
  {
    path: 'order',
    component: <Order />
  },
  {
    path: 'order/:id',
    component: <OrderOptions />
  },
  {
    path: 'categories',
    component: <Categories />
  },
  {
    path: 'categories/:id',
    component: <CategoryForm />
  },
  {
    path: 'profile',
    component: <Profile />
  }
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas públicas */}
        {
          PUBLIC.map((p,i) => {
            return <Route key={i} path={p.path} element={<AuthBlock children={p.component} />} />
          })
        }
        {/* Rutas protegidas */}
        {
          PROTECT.map ((p,i) => {
            return (
              <Route
                key={i}
                element={
                  <RequireAuth
                    allowedRoles={
                      [
                        ROLES.User,
                        ROLES.Editor,
                        ROLES.Admin
                      ]
                    }
                />}
                children={
                  <Route
                    path={p.path}
                    element={
                      <NaviComponent
                        children={p.component}
                      />
                    }
                  />
                }
              />
            )
          })
        }
        {/* Manejo de errores */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
