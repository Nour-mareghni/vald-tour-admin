import { Outlet } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";

export default function App() {
  return (
    <>
      <CssBaseline /> {/* Resets default browser styles */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet /> {/* Renders child routes (Login, Dashboard, etc.) */}
      </Container>
    </>
  );
}