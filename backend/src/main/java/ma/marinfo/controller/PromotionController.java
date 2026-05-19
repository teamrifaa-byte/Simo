package ma.marinfo.controller;

import lombok.RequiredArgsConstructor;
import ma.marinfo.entity.Promotion;
import ma.marinfo.service.PromotionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService service;

    @GetMapping("/actives")
    public List<Promotion> actives() { return service.actives(); }
}
