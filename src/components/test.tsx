const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: updatedMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response');
        }

        const data = await response.json();

        const assistantMessage: Message = {
            id: updatedMessages.length + 1,
            role: "assistant",
            content: data.message,
        };

        setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
        console.error("Error calling API:", error);
        
        const errorMessage: Message = {
            id: updatedMessages.length + 1,
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages([...updatedMessages, errorMessage]);
    } finally {
        setIsLoading(false);
    }
};