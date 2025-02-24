const { google } = require('googleapis');

const getMails = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        // console.log(accessToken);
        // Ensure the user is authenticated
        // if (!req.user || !req.user.accessToken || !accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const pageToken = req.query.pageToken || null;

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Gmail API
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch emails from inbox with pagination
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: limit,
            pageToken: pageToken,
            q: 'in:inbox'    // Only fetch inbox emails
        });

        // Get detailed information for each email
        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full'
                });

                let body = '';
                if (email.data.payload.parts) {
                    const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain');
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                } else if (email.data.payload.body.data) {
                    body = Buffer.from(email.data.payload.body.data, 'base64').toString();
                }

                // Filter only required headers
                const headers = email.data.payload.headers.reduce((acc, header) => {
                    if (['subject', 'from', 'date'].includes(header.name.toLowerCase())) {
                        acc[header.name.toLowerCase()] = header.value;
                    }
                    return acc;
                }, {});

                return {
                    id: email.data.id,
                    threadId: email.data.threadId,
                    headers,
                    body
                };
            })
        );

        // Prepare pagination metadata
        const paginationInfo = {
            currentPage: page,
            itemsPerPage: limit,
            nextPageToken: response.data.nextPageToken || null,
            hasNextPage: !!response.data.nextPageToken
        };

        res.status(200).json({
            emails,
            pagination: paginationInfo
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
};

const getAcademicMails = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        // Ensure the user is authenticated
        // if (!req.user || !req.user.accessToken || !accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const pageToken = req.query.pageToken || null;

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Gmail API
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch emails from inbox with pagination and classroom filter
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: limit,
            pageToken: pageToken,
            q: 'from:@classroom.google.com'  // Filter for classroom emails
        });

        // Get detailed information for each email
        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full'
                });

                let body = '';
                if (email.data.payload.parts) {
                    const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain');
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                } else if (email.data.payload.body.data) {
                    body = Buffer.from(email.data.payload.body.data, 'base64').toString();
                }

                // Filter only required headers
                const headers = email.data.payload.headers.reduce((acc, header) => {
                    if (['subject', 'from', 'date'].includes(header.name.toLowerCase())) {
                        acc[header.name.toLowerCase()] = header.value;
                    }
                    return acc;
                }, {});

                return {
                    id: email.data.id,
                    threadId: email.data.threadId,
                    headers,
                    body
                };
            })
        );

        // Prepare pagination metadata
        const paginationInfo = {
            currentPage: page,
            itemsPerPage: limit,
            nextPageToken: response.data.nextPageToken || null,
            hasNextPage: !!response.data.nextPageToken
        };

        res.status(200).json({
            emails,
            pagination: paginationInfo
        });
    } catch (error) {
        console.error('Error fetching academic emails:', error);
        res.status(500).json({ error: 'Failed to fetch academic emails' });
    }
};

const getOtherMails = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        // Ensure the user is authenticated
        // if (!req.user || !req.user.accessToken || !accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const pageToken = req.query.pageToken || null;

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Gmail API
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch emails from inbox with pagination, excluding classroom and christ university emails
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: limit,
            pageToken: pageToken,
            q: '-from:@classroom.google.com -from:@mca.christuniversity.in'
        });

        // Get detailed information for each email
        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full'
                });

                let body = '';
                if (email.data.payload.parts) {
                    const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain');
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                } else if (email.data.payload.body.data) {
                    body = Buffer.from(email.data.payload.body.data, 'base64').toString();
                }

                // Filter only required headers
                const headers = email.data.payload.headers.reduce((acc, header) => {
                    if (['subject', 'from', 'date'].includes(header.name.toLowerCase())) {
                        acc[header.name.toLowerCase()] = header.value;
                    }
                    return acc;
                }, {});

                return {
                    id: email.data.id,
                    threadId: email.data.threadId,
                    headers,
                    body
                };
            })
        );

        // Prepare pagination metadata
        const paginationInfo = {
            currentPage: page,
            itemsPerPage: limit,
            nextPageToken: response.data.nextPageToken || null,
            hasNextPage: !!response.data.nextPageToken
        };

        res.status(200).json({
            emails,
            pagination: paginationInfo
        });
    } catch (error) {
        console.error('Error fetching non-academic emails:', error);
        res.status(500).json({ error: 'Failed to fetch non-academic emails' });
    }
};

const getDepartmentMails = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        // Ensure the user is authenticated
        // if (!req.user || !req.user.accessToken || !accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const pageToken = req.query.pageToken || null;

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Gmail API
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch emails from inbox with pagination and department filter
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: limit,
            pageToken: pageToken,
            q: 'from:@mca.christuniversity.in'  // Filter for department emails
        });

        // Get detailed information for each email
        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full'
                });

                let body = '';
                if (email.data.payload.parts) {
                    const textPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain');
                    if (textPart && textPart.body.data) {
                        body = Buffer.from(textPart.body.data, 'base64').toString();
                    }
                } else if (email.data.payload.body.data) {
                    body = Buffer.from(email.data.payload.body.data, 'base64').toString();
                }

                // Filter only required headers
                const headers = email.data.payload.headers.reduce((acc, header) => {
                    if (['subject', 'from', 'date'].includes(header.name.toLowerCase())) {
                        acc[header.name.toLowerCase()] = header.value;
                    }
                    return acc;
                }, {});

                return {
                    id: email.data.id,
                    threadId: email.data.threadId,
                    headers,
                    body
                };
            })
        );

        // Prepare pagination metadata
        const paginationInfo = {
            currentPage: page,
            itemsPerPage: limit,
            nextPageToken: response.data.nextPageToken || null,
            hasNextPage: !!response.data.nextPageToken
        };

        res.status(200).json({
            emails,
            pagination: paginationInfo
        });
    } catch (error) {
        console.error('Error fetching department emails:', error);
        res.status(500).json({ error: 'Failed to fetch department emails' });
    }
};

module.exports = {
    getMails,
    getAcademicMails,
    getOtherMails,
    getDepartmentMails
};
