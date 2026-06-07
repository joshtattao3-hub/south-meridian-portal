const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth",          require("./routes/auth"));
app.use("/api/users",         require("./routes/users"));
app.use("/api/complaints",    require("./routes/complaints"));
app.use("/api/dues",          require("./routes/dues"));
app.use("/api/reservations",  require("./routes/reservations"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/facilities",    require("./routes/facilities"));
app.use("/api/events",        require("./routes/events"));

app.use("/uploads", require("express").static("uploads"));

app.use(require("./middleware/errorHandler"));

app.get("/", (req, res) => res.json({ message: "South Meridian HOA API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));