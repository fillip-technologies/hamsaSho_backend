<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // POST /api/contacts  — public
    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:150',
            'email'  => 'required|email|max:150',
            'mobile' => 'required|string|max:50',
        ]);

        $contact = Contact::create([
            'name'         => trim($request->name),
            'organization' => trim($request->organization ?? 'Not specified'),
            'designation'  => trim($request->designation ?? 'Not specified'),
            'email'        => strtolower(trim($request->email)),
            'mobile'       => trim($request->mobile),
            'city'         => trim($request->city ?? ''),
            'hospital_type'=> trim($request->hospitalType ?? $request->hospital_type ?? 'Other'),
            'beds'         => trim($request->beds ?? ''),
            'product'      => $request->product ?? 'e_Kshitiz',
            'current_his'  => trim($request->currentHis ?? $request->current_his ?? ''),
            'message'      => trim($request->message ?? ''),
            'status'       => 'New',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiry / demo request submitted successfully.',
            'data'    => $this->format($contact),
        ], 201);
    }

    // GET /api/contacts  — admin
    public function index(Request $request)
    {
        $query = Contact::query();

        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->product && $request->product !== 'All') {
            $query->where('product', $request->product);
        }

        if ($request->search) {
            $s = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', $s)
                  ->orWhere('organization', 'like', $s)
                  ->orWhere('email', 'like', $s)
                  ->orWhere('mobile', 'like', $s)
                  ->orWhere('city', 'like', $s)
                  ->orWhere('designation', 'like', $s);
            });
        }

        $contacts = $query->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'count'   => $contacts->count(),
            'data'    => $contacts->map(fn($c) => $this->format($c)),
        ]);
    }

    // GET /api/contacts/stats  — admin
    public function stats()
    {
        return response()->json([
            'success' => true,
            'stats'   => [
                'total'      => Contact::count(),
                'new'        => Contact::where('status', 'New')->count(),
                'contacted'  => Contact::where('status', 'Contacted')->count(),
                'inProgress' => Contact::where('status', 'In Progress')->count(),
                'closed'     => Contact::where('status', 'Closed')->count(),
            ],
        ]);
    }

    // PATCH /api/contacts/{id}/status  — admin
    public function updateStatus(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact submission not found.',
            ], 404);
        }

        if ($request->has('status')) {
            $contact->status = $request->status;
        }
        if ($request->has('adminNotes')) {
            $contact->admin_notes = $request->adminNotes;
        }

        $contact->save();

        return response()->json([
            'success' => true,
            'message' => 'Contact status updated successfully.',
            'data'    => $this->format($contact),
        ]);
    }

    // DELETE /api/contacts/{id}  — admin
    public function destroy($id)
    {
        Contact::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Inquiry record deleted successfully.',
            'data'    => ['id' => $id],
        ]);
    }

    private function format(Contact $c): array
    {
        return [
            '_id'          => $c->id,
            'id'           => $c->id,
            'name'         => $c->name,
            'organization' => $c->organization,
            'designation'  => $c->designation,
            'email'        => $c->email,
            'mobile'       => $c->mobile,
            'city'         => $c->city,
            'hospitalType' => $c->hospital_type,
            'hospital_type'=> $c->hospital_type,
            'beds'         => $c->beds,
            'product'      => $c->product,
            'currentHis'   => $c->current_his,
            'current_his'  => $c->current_his,
            'message'      => $c->message,
            'status'       => $c->status,
            'adminNotes'   => $c->admin_notes ?? '',
            'createdAt'    => $c->created_at,
            'updatedAt'    => $c->updated_at,
        ];
    }
}
