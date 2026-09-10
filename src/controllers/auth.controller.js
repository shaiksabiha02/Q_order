import authService from "../services/auth.service.js";

const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const user = await authService.login(
            username,
            password
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                tenant_id: user.tenant_id,
                branch_id: user.branch_id
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default {
    login
};