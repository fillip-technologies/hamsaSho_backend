<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // GET /api/testimonials  — public (active only) / admin (all)
    public function index(Request $request)
    {
        $activeOnly = $request->query('active') === 'true' || !$request->hasHeader('Authorization');

        $query = Testimonial::orderBy('sort_order')->orderBy('id');
        if ($activeOnly) {
            $query->where('is_active', true);
        }

        $testimonials = $query->get()->map(fn($t) => $this->format($t));

        return response()->json([
            'success' => true,
            'count'   => $testimonials->count(),
            'data'    => $testimonials,
        ]);
    }

    // POST /api/testimonials  — admin
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:200',
            'hospital' => 'required|string|max:200',
            'quote'    => 'required|string',
        ]);

        $testimonial = Testimonial::create([
            'name'            => trim($request->name),
            'position'        => $request->position ? trim($request->position) : null,
            'hospital'        => trim($request->hospital),
            'quote'           => trim($request->quote),
            'logo_url'        => $request->logoUrl ? trim($request->logoUrl) : null,
            'backdrop_color'  => $request->backdropColor ?? '#FF4D27',
            'backdrop_rotate' => $request->backdropRotate ?? 'rotate-6',
            'avatar_bg'       => $request->avatarBg ?? 'bg-white',
            'is_active'       => $request->isActive !== false,
            'sort_order'      => $request->sortOrder ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $this->format($testimonial),
        ], 201);
    }

    // PUT /api/testimonials/{id}  — admin
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found.',
            ], 404);
        }

        $testimonial->update([
            'name'            => trim($request->name),
            'position'        => $request->position ? trim($request->position) : null,
            'hospital'        => trim($request->hospital),
            'quote'           => trim($request->quote),
            'logo_url'        => $request->logoUrl ? trim($request->logoUrl) : null,
            'backdrop_color'  => $request->backdropColor ?? '#FF4D27',
            'backdrop_rotate' => $request->backdropRotate ?? 'rotate-6',
            'avatar_bg'       => $request->avatarBg ?? 'bg-white',
            'is_active'       => $request->isActive !== false,
            'sort_order'      => $request->sortOrder ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $this->format($testimonial->fresh()),
        ]);
    }

    // DELETE /api/testimonials/{id}  — admin
    public function destroy($id)
    {
        Testimonial::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted.',
        ]);
    }

    private function format(Testimonial $t): array
    {
        return [
            'id'             => $t->id,
            'name'           => $t->name,
            'position'       => $t->position,
            'hospital'       => $t->hospital,
            'quote'          => $t->quote,
            'logoUrl'        => $t->logo_url,
            'backdropColor'  => $t->backdrop_color,
            'backdropRotate' => $t->backdrop_rotate,
            'avatarBg'       => $t->avatar_bg,
            'isActive'       => $t->is_active,
            'sortOrder'      => $t->sort_order,
            'createdAt'      => $t->created_at,
            'updatedAt'      => $t->updated_at,
        ];
    }
}
