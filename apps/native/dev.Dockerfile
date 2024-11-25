FROM base

WORKDIR /app/apps/native
COPY . .

ENV EXPO_TOKEN=ljSvqjpe92xWVjzzJio5KbtSFCHfq6jBvXvVV_9_
ENV EXPO_PUBLIC_API_URL=http://37.61.77.5

CMD yarn start
