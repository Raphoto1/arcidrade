import { NextRequest, NextResponse } from 'next/server';
import { 
    getCampaignData, 
    createCampaignData, 
    updateCampaignData, 
    upsertCampaignData,
    deleteCampaignData 
} from '@/controller/campaign.controller';

export async function GET() {
    try {
        const result = await getCampaignData();
        
        if (!result) {
            return NextResponse.json({ 
                message: 'No campaign data found', 
                payload: null 
            });
        }
        
        return NextResponse.json({ 
            message: 'Campaign data retrieved successfully', 
            payload: result 
        });
    } catch (error) {
        console.error('Error in campaign GET route:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        
        if (errorMessage.includes('No autorizado')) {
            return NextResponse.json({ error: errorMessage }, { status: 403 });
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        // Usar upsert para manejar tanto creación como actualización
        const result = await upsertCampaignData(data);
        
        return NextResponse.json({ 
            message: `Campaign data ${result.action} successfully`, 
            payload: result.data,
            action: result.action 
        });
    } catch (error) {
        console.error('Error in campaign POST route:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        
        if (errorMessage.includes('No autorizado')) {
            return NextResponse.json({ error: errorMessage }, { status: 403 });
        }
        
        if (errorMessage.includes('required') || errorMessage.includes('cannot be empty')) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        
        const result = await updateCampaignData(data);
        
        return NextResponse.json({ 
            message: 'Campaign data updated successfully', 
            payload: result 
        });
    } catch (error) {
        console.error('Error in campaign PUT route:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        
        if (errorMessage.includes('No autorizado')) {
            return NextResponse.json({ error: errorMessage }, { status: 403 });
        }
        
        if (errorMessage.includes('not found')) {
            return NextResponse.json({ error: errorMessage }, { status: 404 });
        }
        
        if (errorMessage.includes('required') || errorMessage.includes('cannot be empty')) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const result = await deleteCampaignData();
        
        return NextResponse.json({ 
            message: 'Campaign data deleted successfully', 
            payload: result 
        });
    } catch (error) {
        console.error('Error in campaign DELETE route:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        
        if (errorMessage.includes('No autorizado')) {
            return NextResponse.json({ error: errorMessage }, { status: 403 });
        }
        
        if (errorMessage.includes('not found')) {
            return NextResponse.json({ error: errorMessage }, { status: 404 });
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}