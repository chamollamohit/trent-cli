import prisma from "../lib/db.js";



export class ChatService {
    /**
     * Create a new Conversation
     * @param {string} userId - User ID
     * @param {string} mode - chat, tool, or agent
     * @param {string} title - Optional conversation title
     */

    async createConversation(userId, mode = "chat", title = null) {
        return await prisma.conversation.create({
            data: {
                userId,
                mode,
                title: title || `New ${mode} conversation`,
            }
        })
    }

    /**
     * Get or Create a Conversation for user
     * @param {string} userId - User ID
     * @param {string} conversationId - Optional COnversation ID
     * @param {string} mode - Chat, tool or agent
     */

    async getOrCreateConversation(userId, conversationId, mode = "chat") {
        if (conversationId) {
            const conversation = await prisma.conversation.findFirst({
                where: {
                    id: conversationId,
                    userId
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "asc"
                        },
                    }
                }
            })

            if (conversation) return conversation
        }
        return await this.createConversation(userId, mode)
    }

    /**
    * Add a message to conversation
    * @param {string} conversationId - COnversation ID
    * @param {string} role - user, assistant, tool, system
    * @param {string} content - Message content
    */

    async addMessage(conversationId, role, content) {
        // Convert content to JSON String if its an object

        const contentStr = typeof content === "string" ? content : JSON.stringify(content)

        return await prisma.message.create({
            data: {
                content: contentStr,
                role,
                conversationId
            }
        })
    }

    /**
    * Get conversation messages
    * @param {string} conversationId - Conversation ID
    */

    async getMessages(conversationId) {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
            },
            orderBy: { createdAt: "asc" }
        })

        // Parse JSON Content back to objects if needed
        return messages.map((message) => ({
            ...message, content: this.parseContent(message.content)
        }))
    }

    /**
    * Get all conversation from user
    * @param {string} userId - User ID
    */

    async getUserConversation(userId) {
        return await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })
    }

    /**
    * delete a conversation 
    * @param {string} conversationId - Conversation ID
    * @param {string} userId - User ID
    */

    async deleteConversation(conversationId, userId) {
        return await prisma.conversation.delete({
            where: {
                id: conversationId,
                userId
            }
        })
    }

    /**
     * Update conversation Title
     * @param {string} conversationId - Conversation ID
     * @param {string} title 
     */

    async updateTitle(conversationId, title) {
        return await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                title
            }
        })
    }

    /**
     * Helper to parse content (JSON or string)
     * @param {string} content - content
     */

    parseContent(content) {
        try {
            return JSON.parse(content)
        } catch (error) {
            return content
        }
    }

    /**
     * Format messages for AI SDK
     * @param {Array} messages - Database messages
     */

    formatMessageForAI(meessages) {
        return meessages.map((msg) => ({
            role: msg.role,
            content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
        }))
    }
}