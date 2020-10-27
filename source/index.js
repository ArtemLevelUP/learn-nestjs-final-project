// Instruments
import { app } from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Server API is up on port ${PORT}`);
});
