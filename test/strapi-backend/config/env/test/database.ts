import path from 'path';

export default ({ env }: {env: any}) => {
	const dbPath = path.join(__dirname, '..', '..', "..", ".." , '.tmp/testing.db');
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: dbPath,
      },
      useNullAsDefault: true
    },
  };
};

