"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const transporter_1 = __importDefault(require("./config/transporter"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
dotenv_1.default.config();
transporter_1.default.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    }
    else {
        console.log('SMTP connection successful:', success);
    }
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
// Connect to Database
(0, db_1.default)();
console.log('after db connect');
// Mount the auth routes
app.use('/api/auth', auth_1.default);
app.use('/api/tasks', tasks_1.default);
// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
