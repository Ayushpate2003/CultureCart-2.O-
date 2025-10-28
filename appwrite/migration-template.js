/**
 * CultureCart Database Migration Template
 * Use this template to create schema migration scripts
 */

const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function migrateCollection() {
    try {
        console.log('🚀 Starting migration...');

        // Example: Add new field to existing collection
        const collectionId = 'products';
        const newAttribute = 'ecoFriendly';

        // Check if attribute already exists
        try {
            await databases.getAttribute(
                process.env.APPWRITE_DATABASE_ID,
                collectionId,
                newAttribute
            );
            console.log(`✅ Attribute ${newAttribute} already exists`);
            return;
        } catch (error) {
            // Attribute doesn't exist, create it
        }

        // Create new boolean attribute
        await databases.createBooleanAttribute(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            newAttribute,
            false, // required
            false  // default
        );

        console.log(`✅ Added ${newAttribute} attribute to ${collectionId}`);

        // Optional: Update existing documents with default values
        const documents = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            [sdk.Query.limit(1000)]
        );

        for (const doc of documents.documents) {
            // Set default value for existing documents
            await databases.updateDocument(
                process.env.APPWRITE_DATABASE_ID,
                collectionId,
                doc.$id,
                {
                    [newAttribute]: false,
                    updatedAt: new Date().toISOString()
                }
            );
        }

        console.log(`✅ Migration completed for ${documents.total} documents`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Migration examples for common scenarios

async function addIndexToCollection() {
    const collectionId = 'products';
    const indexKey = 'eco_featured';
    const attributes = ['ecoFriendly', 'featured'];

    try {
        await databases.createIndex(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            indexKey,
            'key',
            attributes
        );
        console.log(`✅ Created index ${indexKey}`);
    } catch (error) {
        console.log(`Index ${indexKey} may already exist`);
    }
}

async function updateAttributeSize() {
    const collectionId = 'products';
    const attributeKey = 'description';

    // Note: Appwrite doesn't support changing attribute size directly
    // You need to create a new attribute and migrate data

    try {
        // Create new attribute with larger size
        await databases.createStringAttribute(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            `${attributeKey}_new`,
            3000, // new size
            false // required
        );

        // Migrate data
        const documents = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            [sdk.Query.limit(1000)]
        );

        for (const doc of documents.documents) {
            await databases.updateDocument(
                process.env.APPWRITE_DATABASE_ID,
                collectionId,
                doc.$id,
                {
                    [`${attributeKey}_new`]: doc[attributeKey] || '',
                    updatedAt: new Date().toISOString()
                }
            );
        }

        console.log('✅ Data migrated to new attribute');

        // Note: In production, you'd then:
        // 1. Update application code to use new attribute
        // 2. Delete old attribute after verification
        // 3. Rename new attribute if needed

    } catch (error) {
        console.error('❌ Attribute size update failed:', error);
    }
}

async function createNewCollection() {
    const collectionId = 'product_categories';
    const name = 'Product Categories';

    try {
        await databases.createCollection(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            name,
            [
                'read("any")',
                'create("role:admin")',
                'update("role:admin")',
                'delete("role:admin")'
            ],
            true // document security
        );

        // Add attributes
        await databases.createStringAttribute(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            'categoryId',
            36,
            true
        );

        await databases.createStringAttribute(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            'name',
            100,
            true
        );

        await databases.createStringAttribute(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            'description',
            500,
            false
        );

        // Create index
        await databases.createIndex(
            process.env.APPWRITE_DATABASE_ID,
            collectionId,
            'categoryId',
            'unique',
            ['categoryId']
        );

        console.log(`✅ Created collection ${collectionId}`);

    } catch (error) {
        console.error(`❌ Failed to create collection ${collectionId}:`, error);
    }
}

// Run migration
if (require.main === module) {
    migrateCollection()
        .then(() => {
            console.log('🎉 Migration completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Migration failed:', error);
            process.exit(1);
        });
}

module.exports = {
    migrateCollection,
    addIndexToCollection,
    updateAttributeSize,
    createNewCollection
};
