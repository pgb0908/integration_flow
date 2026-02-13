package com.example.cp.deploy;

import com.example.shared.api.RouteDeployRequest;
import org.springframework.stereotype.Component;

/**
 * Data-Plane으로 Route 설정을 전달하는 배포 관리자.
 */
@Component
public class DeployManager {

    /**
     * Data-Plane에 Route 배포 요청을 전송한다.
     *
     * @param request 배포 요청 DTO
     */
    public void deploy(RouteDeployRequest request) {
        // TODO: Data-Plane HTTP/gRPC 호출 구현
    }
}
