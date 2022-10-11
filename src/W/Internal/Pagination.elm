module W.Internal.Pagination exposing (toPages)


toPages : Int -> Int -> Result String (List Int)
toPages active total =
    if active < 1 || active > total then
        Err "Active must be larger than 1 and less or equal length"

    else
        Ok
            (if total <= 7 then
                List.range 1 total

             else if total - active <= 3 then
                [ 1, -1, total - 4, total - 3, total - 2, total - 1, total ]

             else if active <= 4 then
                [ 1, 2, 3, 4, 5, -1, total ]

             else
                [ 1, -1, active - 1, active, active + 1, -1, total ]
            )
